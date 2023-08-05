function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${day}/${month}/${year}`
}

function testUpdateSpend() {
  updateSpend(new Date("2023-08-02"), "Psicólogo", 1000)
}
