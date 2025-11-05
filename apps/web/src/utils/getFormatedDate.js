export const getFormatedDate = (date) => {
  if (!date) return

  const formatedDate = new Date(date)

  const day = formatedDate.getDate().toString().padStart(2, '0')
  const month = (formatedDate.getMonth() + 1).toString().padStart(2, '0')
  const year = formatedDate.getFullYear().toString()

  return `${year}-${month}-${day}`
}