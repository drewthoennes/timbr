const mapStateToProps = (state) => ({
  store: {
    account: state.account,
    pets: state.pets.pets,
    users: state.users.users,
  },
});

export default mapStateToProps;
