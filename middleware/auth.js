export default function({ store, redirect }) {
  //To prevent any user to go back to a login or register page
  if (store.getters.isAuthenticated) {
    return redirect('/')
  }
}
