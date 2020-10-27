const mapStateToProps = (state) => ({
  store: {
    account: state.account,
    pets: state.pets.pets,
    plants: state.plants.plants,
    users: state.users.users,
  },
});

export default mapStateToProps;
