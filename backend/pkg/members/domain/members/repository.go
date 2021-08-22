package members

type ListOptions struct {
	SortAlphabetically bool
}

type Repository interface {
	Save(member Member) error
	List(options ListOptions) ([]Member, error)
	FindById(id string) (*Member, error)
	DeleteById(id string) error
}
