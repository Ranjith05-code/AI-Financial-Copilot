const TypingIndicator = () => {

    return (

        <div className="flex justify-start mb-5">

            <div className="bg-slate-800 px-5 py-4 rounded-2xl shadow-lg">

                <div className="flex gap-2">

                    <div className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"></div>

                    <div
                        className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"
                        style={{
                            animationDelay: "0.2s",
                        }}
                    ></div>

                    <div
                        className="w-3 h-3 rounded-full bg-blue-400 animate-bounce"
                        style={{
                            animationDelay: "0.4s",
                        }}
                    ></div>

                </div>

            </div>

        </div>

    );

};

export default TypingIndicator;