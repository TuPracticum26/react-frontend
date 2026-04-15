import { useEffect, useRef, useState } from "react";
import useGetUsers from "../hooks/useGetUsers";
import ManageUsersStyles from "./ManageUsers.module.css";

function UserCard({ id, username, roles }) {
    const adminOption = useRef();
    const reviewerOption = useRef();
    const authorOption = useRef();
    const readerOption = useRef();
    const [rolesArray, setRolesArray] = useState(() =>
        ["ADMIN", "REVIEWER", "AUTHOR", "READER"].filter((role) =>
            roles.includes(role),
        ),
    );

    useEffect(() => {
        {
            adminOption.current.checked = roles.includes("ADMIN");
            reviewerOption.current.checked = roles.includes("REVIEWER");
            authorOption.current.checked = roles.includes("AUTHOR");
            readerOption.current.checked = roles.includes("READER");
        }
    }, []);

    function addRemoveRole(e) {
        if (e.target.checked) {
            if (!rolesArray.includes(e.target.name)) {
                setRolesArray((past) => [...past, e.target.name]);
            }
        } else {
            setRolesArray(rolesArray.filter((role) => role != e.target.name));
        }
    }

    async function changeUserRoles() {
        await fetch(`/api/v1/admin/setRole/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(rolesArray),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response;
            })
            .then(() => alert("Roles updated successfully!"))
            .catch((error) => console.error("Error: ", error));
    }

    async function deleteUser() {
        await fetch(`/api/v1/admin/deleteUser/${id}`, {
            method: "DELETE",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Request failed");
                }
                return response;
            })
            .then(() => {
                alert("User deleted successfully!");
                window.location.reload();
            })
            .catch((error) => console.error("Error: ", error));
    }

    return (
        <div className={ManageUsersStyles["roles-container"]}>
            <div className={ManageUsersStyles["id-name"]}>
                <h2>{id}</h2>
                <h2>{username}</h2>
            </div>

            <button
                className={ManageUsersStyles["delete-btn"]}
                onClick={deleteUser}
            >
                Delete User
            </button>

            <div className={ManageUsersStyles["roles"]}>
                <input
                    type="checkbox"
                    name="ADMIN"
                    id=""
                    ref={adminOption}
                    onChange={(e) => {
                        addRemoveRole(e);
                    }}
                />
                <label htmlFor="ADMIN">ADMIN</label>

                <input
                    type="checkbox"
                    name="REVIEWER"
                    id=""
                    ref={reviewerOption}
                    onChange={(e) => {
                        addRemoveRole(e);
                    }}
                />
                <label htmlFor="REVIEWER">REVIEWER</label>

                <input
                    type="checkbox"
                    name="AUTHOR"
                    id=""
                    ref={authorOption}
                    onChange={(e) => {
                        addRemoveRole(e);
                    }}
                />
                <label htmlFor="AUTHOR">AUTHOR</label>

                <input
                    type="checkbox"
                    name="READER"
                    id=""
                    ref={readerOption}
                    onChange={(e) => {
                        addRemoveRole(e);
                    }}
                />
                <label htmlFor="READER">READER</label>
            </div>

            <button
                onClick={changeUserRoles}
                className={ManageUsersStyles["save-btn"]}
            >
                Save
            </button>
        </div>
    );
}

export default function ManageUsers({ pageUsers = [], page, setPage }) {
    const users = useGetUsers();
    const [searchResult, setSearchResult] = useState("");

    return (
        <div className={ManageUsersStyles["manage-users-container"]}>
            <h1>Select to which user manage</h1>

            <input
                autoFocus={true}
                className={ManageUsersStyles["search-bar"]}
                type="text"
                onChange={(e) => {
                    setSearchResult(e.target.value);
                }}
                onFocus={(e) => {
                    setSearchResult(e.target.value);
                }}
                placeholder="Search user..."
            />

            <div className={ManageUsersStyles["user-card-container"]}>
                {searchResult != "" ? (
                    <>
                        {users.map((user) => {
                            if (
                                user.username
                                    .toLowerCase()
                                    .includes(searchResult.toLowerCase()) ||
                                searchResult == user.id
                            ) {
                                return (
                                    <UserCard
                                        key={user.id}
                                        id={user.id}
                                        username={user.username}
                                        roles={user.roles}
                                    />
                                );
                            }
                        })}
                    </>
                ) : (
                    <>
                        {pageUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                id={user.id}
                                username={user.username}
                                roles={user.roles}
                            />
                        ))}
                    </>
                )}
            </div>
            {searchResult == "" ? (
                <div className={ManageUsersStyles["page-buttons-container"]}>
                    <button
                        disabled={page <= 0}
                        onClick={() => setPage(page - 1)}
                        className={ManageUsersStyles["page-button"]}
                    >
                        Prev
                    </button>
                    <button
                        disabled={pageUsers.length < 2}
                        onClick={() => setPage(page + 1)}
                        className={ManageUsersStyles["page-button"]}
                    >
                        Next
                    </button>
                </div>
            ) : null}
        </div>
    );
}
