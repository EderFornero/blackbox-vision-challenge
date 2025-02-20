export const getQuestionAPI = async () => {
  const res = await fetch("https://opentdb.com/api.php?amount=10")
    .then((res) => res.json())
    .then((res) => res.results);

  return res;
};
