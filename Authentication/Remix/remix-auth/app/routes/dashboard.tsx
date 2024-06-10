import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export function dashboard() {
  return <div>welcome to the dashboard</div>;
}

export async function action({ request }: ActionFunctionArgs) {
  return null;
}

export async function loader({ request }: LoaderFunctionArgs) {
  return null;
}
