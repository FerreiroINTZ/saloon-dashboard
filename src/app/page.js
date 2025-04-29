import{redirect} from "next/navigation"

export default async function Home({children}) {

  redirect("/not-found/use-um-link-valido")

  return (
    <div>
      {children}
    </div>
  );
}
