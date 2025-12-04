import UserCard from "@/components/cards/UserCard"
import DataRenderer from "@/components/DataRenderer"
import LocalSearch from "@/components/search/LocalSearch"
import ROUTES from "@/constants/routes"
import { EMPTY_USER } from "@/constants/states"
import { getAllUsers } from "@/lib/actions/user.action"

const Community = async ({ searchParams }: RouteParam) => {
  const { page, pageSize, filter, query } = await searchParams

  const { success, data, error } = await getAllUsers({
    page: parseInt(page) || 1,
    pageSize: parseInt(pageSize) || 10,
    query,
    filter,
  })

  const { users } = data!


  return <div>
    <h1 className="h1-bold text-dark100_light900"> All Users</h1>
    <div className="mt-11">
      <LocalSearch
        route={ROUTES.COMMUNITY}
        iconPosition="left"
        icon="material-symbols:search-sharp"
        placeHolder="There are some great devs here!"
        otherClasses="flex-1"
      />
    </div>
    <DataRenderer
      success={success}
      error={error}
      data={users}
      empty={EMPTY_USER}
      renderer={(users) => (
        <div className="mt-12 flex flex-wrap gap-5">
          {
            users.map(user => {
              return <UserCard key={user._id} _id={user._id} name={user.name} username={user.username} avatar={user.avatar} />
            })
          }
        </div>
      )
      }
    />
  </div>
}

export default Community
