module.exports.checkAge = (mates) => {
  const dateOfBirthString =
    mates && mates.userProfile && mates?.userProfile?.dob;
  const dateOfBirth = new Date(dateOfBirthString);
  const today = new Date();

  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }
  return isNaN(age) ? 0 : age;
};
