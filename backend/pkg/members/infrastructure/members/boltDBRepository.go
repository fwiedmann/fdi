package members

import (
	"encoding/json"
	"errors"

	"github.com/fwiedmann/fdi/backend/pkg/members/domain/members"
	bolt "go.etcd.io/bbolt"
)

var (
	AllReadyExistsError = errors.New("member already exits")
)

var membersBucketName = []byte("members")

type MemberDbEntity struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Surname string `json:"surname"`
}

func mapToDomainEntity(member MemberDbEntity) members.Member {
	return members.Member{
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

func (b *BoltDBRepository) List() ([]members.Member, error) {
	foundMembers := make([]members.Member, 0)

	addMember := func(_, v []byte) error {
		output := MemberDbEntity{}
		err := json.Unmarshal(v, &output)
		if err != nil {
			return err
		}
		foundMembers = append(foundMembers, mapToDomainEntity(output))
		return nil
	}

	listMembers := func(tx *bolt.Tx) error {
		bucket := tx.Bucket(membersBucketName)
		return bucket.ForEach(addMember)
	}

	err := b.db.View(listMembers)
	if err != nil {
		return nil, err
	}
	return foundMembers, nil
}
