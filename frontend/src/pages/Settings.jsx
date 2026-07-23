import ProfileCard from "../components/settings/ProfileCard";
import UpdateProfileForm from "../components/settings/UpdateProfileForm";
import ChangePasswordForm from "../components/settings/ChangePasswordForm";
import LogoutCard from "../components/settings/LogoutCard";

const Settings = () => {

    return (

        <>

            <div className="mb-8">

                <h1 className="text-4xl font-bold">

                    Settings

                </h1>

                <p className="text-slate-400 mt-2">

                    Manage your account information and security.

                </p>

            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                <ProfileCard />

                <UpdateProfileForm />

            </div>

            <div className="mt-8">

                <ChangePasswordForm />

            </div>

            <div className="mt-8">

                <LogoutCard />

            </div>

        </>

    );

};

export default Settings;