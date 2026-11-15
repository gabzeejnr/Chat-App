import { Search } from "lucide-react";
import type { ChangeEvent, SubmitEvent } from "react";

interface SearchBarProps {
    page: string;
    onSubmit?: (e: SubmitEvent<HTMLFormElement>) => Promise<void>;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ page, onSubmit, value, onChange }: SearchBarProps) {

    return (
        <form onSubmit={onSubmit} className="flex w-full max-w-xl items-center gap-2">
            <div className="relative min-w-0 flex-1">
                <Search aria-hidden="true"
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted"
                />
                <input type="search" name={`${page.toLowerCase()}-search`} id={`${page.toLowerCase()}-search`} aria-label="Search for friends"
                    placeholder="Search by name or username" value={value} onChange={onChange}
                    className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
            </div>
            <button type="submit"
                className="shrink-0 cursor-pointer rounded-lg bg-primary px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
                Search
            </button>
        </form>
    )
}