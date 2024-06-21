import MealItem from "./MealItem";
import useHttp from "../hooks/useHTTP";
import Error from "./Error";

const requestConfig = {
  method: "GET",
};
export default function Meals() {
  const {
    data: loadedMeals,
    isLoading,
    error,
  } = useHttp("http://localhost:3000/meals", requestConfig, []);

  if (isLoading) return <p className="center">Loading...</p>;

  if (error) {
    return <Error title="An error occurred!" message={error}></Error>;
  }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal}></MealItem>
      ))}
    </ul>
  );
}
