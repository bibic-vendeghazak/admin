export function search(name, value) {
  this.setState({[name]: value.toLowerCase().split(" ")})
}