const toInitials = (string: string) => {
    return (string
        ?.trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(n => n[0]?.toUpperCase())
        .join("")
    )
}

export { toInitials }