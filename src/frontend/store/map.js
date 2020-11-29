const mapStateToProps = (state) => ({
  store: {
    account: state.account,
    pets: state.pets.pets,
    genealogy: state.pets.genealogy,
    plants: state.plants.plants,
    users: state.users.users,
  },
});

export default mapStateToProps;
