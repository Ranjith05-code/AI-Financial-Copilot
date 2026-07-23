const GoalCard = ({ goal }) => {

    if (!goal) {

        return (

            <div className="bg-slate-800 rounded-2xl p-8">

                <h2 className="text-xl font-semibold">

                    No Goal Created

                </h2>

                <p className="text-slate-400 mt-2">

                    Create your first savings goal.

                </p>

            </div>

        );

    }

    const percentage = Math.min(

        (goal.savedAmount / goal.targetAmount) * 100,

        100

    );

    return (

        <div className="bg-slate-800 rounded-2xl p-8">

            <h2 className="text-2xl font-bold">

                {goal.title}

            </h2>

            <p className="mt-3">

                Target

                <span className="font-bold">

                    {" "}₹{goal.targetAmount}

                </span>

            </p>

            <p>

                Saved

                <span className="font-bold">

                    {" "}₹{goal.savedAmount}

                </span>

            </p>

            <div className="w-full bg-slate-700 h-4 rounded-full mt-6">

                <div

                    className="bg-green-500 h-4 rounded-full"

                    style={{

                        width: `${percentage}%`,

                    }}

                />

            </div>

            <p className="mt-4">

                {percentage.toFixed(1)}%

            </p>

        </div>

    );

};

export default GoalCard;