const mapStateToProps = (state) => ({
  store: {
    account: state.account,
    pets: state.pets.pets,
  },
});

export default mapStateToProps;
