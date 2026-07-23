const SearchBar = ({
    value,
    onChange,
    placeholder = "Search...",
    className = "",
}) => {

    return (

        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:border-blue-500 transition ${className}`}
        />

    );

};

export default SearchBar;