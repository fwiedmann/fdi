package members

type Repository interface {
	Save(member Member) error
	List() ([]Member, error)
	FindById(id string) (*Member, error)
	DeleteById(id string) error
}
