import {AUTH, ADMINS} from "../../lib/firebase"

export const profile = {
  name: "Bíbic vendégházak",
  src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAOUlEQVR42u3OIQEAAAACIP1/2hkWWEBzVgEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAYF3YDicAEE8VTiYAAAAAElFTkSuQmCC"
}

export async function logout() {
  try {
    await AUTH.signOut()
    this.setState({isLoggedIn: false})
  } catch (error) {
    this.sendNotification(error)
  }
}


export async function getAdmin(userId) {
  return await (await ADMINS.child(userId).once("value")).val()
}