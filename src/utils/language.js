export const translateSubject = subject => {
  switch (subject) {
  case "eventHall":
    subject = "Rendezvényterem"
    break
  case "special":
    subject = "Üzenet"
    break
  case "fullHouse":
    subject = "Teljes ház"
    break
  default:
    subject = "Egyéb"
    break
  }
  return subject
}