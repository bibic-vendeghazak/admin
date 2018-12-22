export const getRatingAverage = ratings => {
  ratings = Object.values(ratings)
  return ratings.reduce((acc, rating) => acc + rating) / ratings.length
}