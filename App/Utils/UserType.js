class UserType {
  constructor () {
    this.isCustomer = true
  }

  setUserType (isCustomer) {
    this.isCustomer = isCustomer
  }

  getUserType() {
    return this.isCustomer
  }
}

export var userTypeInstance = new UserType()
