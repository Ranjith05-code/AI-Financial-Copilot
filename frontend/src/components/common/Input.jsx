const Input = ({
    type = "text",
    name,
    placeholder,
    value,
    onChange,
}) => {
    return (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-400 outline-none transition focus:border-blue-500"
        />
    );
};

export default Input;