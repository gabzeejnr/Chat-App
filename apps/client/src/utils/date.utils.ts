function toTime(date: string | Date) {
    return new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

export { toTime }

type toISOString = `${string}-${string}-${string}T${string}:${string}:${string}.${string}Z`

const toMillisecond = (date: toISOString): number => (new Date(date).getTime())

function toMinute(date: toISOString) {
    return (
        new Date().getTime() - toMillisecond(date)
    ) / 60000
}

console.log(new Intl.DateTimeFormat("en-GB", { minute: "2-digit" }).format(toMinute("2026-11-17T12:23:01.979Z")));

console.log(Math.floor(toMinute("2026-11-17T12:23:01.979Z")));