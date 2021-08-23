package members

import (
	"encoding/json"
	"errors"
	"sort"

	"github.com/fwiedmann/fdi/backend/pkg/members/domain/members"
	bolt "go.etcd.io/bbolt"
)

var (
	AllReadyExistsError = errors.New("member already exists")
)

var membersBucketName = []byte("members")

type MemberDbEntity struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Surname string `json:"surname"`
}

func mapToDomainEntity(member MemberDbEntity) *members.Member {
	return &members.Member{
		Id:      member.Id,
		Name:    member.Name,
		Surname: member.Surname,
	}
}

func mapToDbEntity(member members.Member) MemberDbEntity {
	return MemberDbEntity{
		Id:      member.Id,
		Name:    member.Name,
		Surname: member.Surname,
	}
}

func NewBoltDBRepository(dbLocation string) (*BoltDBRepository, error) {
	db, err := bolt.Open(dbLocation, 0600, nil)
	if err != nil {
		return nil, err
	}

	err = db.Update(func(tx *bolt.Tx) error {
		_, err := tx.CreateBucketIfNotExists(membersBucketName)
		return err
	})

	if err != nil {
		return nil, err
	}

	return &BoltDBRepository{
		db: db,
	}, nil
}

type BoltDBRepository struct {
	db *bolt.DB
}

// FindById lookup the member by id, if not found it will return nil for member
func (b *BoltDBRepository) FindById(id string) (*members.Member, error) {
	var member *members.Member
	err := b.db.View(func(tx *bolt.Tx) error {
		dbMember := tx.Bucket(membersBucketName).Get([]byte(id))
		if dbMember == nil {
			return nil
		}

		var m MemberDbEntity
		err := json.Unmarshal(dbMember, &m)
		if err != nil {
			return err
		}

		member = mapToDomainEntity(m)
		return nil
	})
	if err != nil {
		return nil, err
	}
	return member, nil
}

func (b *BoltDBRepository) DeleteById(id string) error {
	return b.db.Update(func(tx *bolt.Tx) error {
		return tx.Bucket(membersBucketName).Delete([]byte(id))
	})
}

func (b *BoltDBRepository) Save(member members.Member) error {
	saveFunc := func(tx *bolt.Tx) error {
		bucket := tx.Bucket(membersBucketName)
		if bucket.Get([]byte(member.Id)) != nil {
			return AllReadyExistsError
		}

		input, err := json.Marshal(mapToDbEntity(member))
		if err != nil {
			return err
		}
		return bucket.Put([]byte(member.Id), input)
	}
	return b.db.Update(saveFunc)
}

func (b *BoltDBRepository) List(options members.ListOptions) ([]members.Member, error) {
	foundMembers := make([]members.Member, 0)

	addMember := func(_, v []byte) error {
		output := MemberDbEntity{}
		err := json.Unmarshal(v, &output)
		if err != nil {
			return err
		}
		foundMembers = append(foundMembers, *mapToDomainEntity(output))
		return nil
	}

	listMembersFun := func(tx *bolt.Tx) error {
		bucket := tx.Bucket(membersBucketName)
		return bucket.ForEach(addMember)
	}

	err := b.db.View(listMembersFun)
	if err != nil {
		return nil, err
	}

	if options.SortAlphabetically {
		sort.Slice(foundMembers, func(i, j int) bool {
			if foundMembers[i].Surname < foundMembers[j].Surname {
				return true
			}
			// if booth surnames are identically, check for name
			if foundMembers[i].Surname == foundMembers[j].Surname {
				if foundMembers[i].Name < foundMembers[j].Name {
					return true
				}
			}
			return false
		})
	}

	return foundMembers, nil
}
