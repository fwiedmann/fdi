package members

type Repository interface {
	Save(member Member) error
	List() ([]Member, error)
}
