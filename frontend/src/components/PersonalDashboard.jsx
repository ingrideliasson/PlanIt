import useCurrentUser from "../hooks/useCurrentUser";

export default function PersonalDashboard({onLogout}) {
    const user = useCurrentUser();
    return(
        <div className="p-6">
            {user ? (
                <h1 className="text-2xl font-bold">Welcome, {user.firstName}!</h1>
            ) : (
                <h1>Loading...</h1>
            )}
            <button
                onClick={onLogout}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    );
}