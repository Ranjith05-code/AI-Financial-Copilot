const GoalProgress = ({ goal }) => {

    if (!goal) return null;

    const remaining =

        goal.targetAmount - goal.savedAmount;

    return (

        <div className="bg-slate-800 rounded-2xl p-8">

            <h2 className="text-xl font-bold">

                Goal Progress

            </h2>

            <div className="mt-6 space-y-4">

                <div className="flex justify-between">

                    <span>

                        Target

                    </span>

                    <span>

                        ₹{goal.targetAmount}

                    </span>

                </div>

                <div className="flex justify-between">

                    <span>

                        Saved

                    </span>

                    <span>

                        ₹{goal.savedAmount}

                    </span>

                </div>

                <div className="flex justify-between">

                    <span>

                        Remaining

                    </span>

                    <span>

                        ₹{remaining}

                    </span>

                </div>

            </div>

        </div>

    );

};

export default GoalProgress;