
import { useState, useRef, useEffect } from "react";

export default function MultiSelect({ options, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // close on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const toggle = (val) => {
    if (value.includes(val)) onChange(value.filter((v) => v !== val));
    else onChange([...value, val]);
  };

  // helper to find label by value
  const findLabel = (val) => {
    for (let grp of options)
      for (let opt of grp.options)
        if (opt.value === val) return opt.label;
    return val;
  };

  return (
    <div className="relative" ref={ref}>
      {/* Fake input */}
      <div
        className="flex flex-wrap items-center gap-1 p-2 border rounded cursor-pointer"
        onClick={() => setOpen((o) => !o)}
      >
        {value.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          value.map((val) => (
            <span
              key={val}
              className="flex items-center bg-blue-100 px-2 py-1 rounded-full text-sm"
              onClick={(e) => {
                e.stopPropagation();
                toggle(val);
              }}
            >
              {findLabel(val)}
              <button type="button" className="ml-1">&times;</button>
            </span>
          ))
        )}
        <span className="ml-auto text-gray-500">{open ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-auto bg-white border rounded shadow-lg">
          {options.map((grp, i) => (
            <div key={i}>
              <div className="px-2 py-1 bg-gray-100 font-medium">{grp.label}</div>
              {grp.options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center px-2 py-1 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={value.includes(opt.value)}
                    onChange={() => toggle(opt.value)}
                    className="mr-2"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
