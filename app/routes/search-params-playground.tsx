import type { FC } from "react";
import { useSearchParams } from "react-router";
import type { Route } from "./+types/search-params-playground";

const Component: FC<Route.ComponentProps> = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div>
      <button
        onClick={() =>
          setSearchParams(
            {
              firstName: "John",
              lastName: "Doe",
              products: ["p1", "p2", "p3"],
            },
            { replace: true },
          )
        }
      >
        add initial params and remove others
      </button>
      <button onClick={() => setSearchParams(undefined, { replace: true })}>
        clear all params
      </button>
      <button
        onClick={() => {
          searchParams.set("id", "12345678");
          setSearchParams(searchParams, { replace: true });
        }}
      >
        add ID
      </button>
      <button
        onClick={() => {
          searchParams.set("status", "idle");
          searchParams.set("username", "jdoe");
          setSearchParams(searchParams, { replace: true });
        }}
      >
        add status and username
      </button>
      <button
        onClick={() => {
          searchParams.delete("products", "p3");
          setSearchParams(searchParams, { replace: true });
        }}
      >
        delete 3rd product
      </button>
      <button
        onClick={() => {
          if (searchParams.has("status")) {
            searchParams.set("status", "happy");
            setSearchParams(searchParams, { replace: true });
          }
        }}
      >
        update status to happy
      </button>
    </div>
  );
};

export default Component;
