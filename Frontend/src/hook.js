//сделать кастомный хук
export const useFilter = () => {
  const [filter, setFilter] = useState("all");

  const setFilterHandler = useCallback((filter) => {
    setFilter(filter);
  }, []);

  return { filter, setFilterHandler };
};
