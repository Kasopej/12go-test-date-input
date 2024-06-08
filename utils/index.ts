export function assertTarget<T extends HTMLElement, E extends Event>(
    event: E, constructor: { new(): T }
): asserts event is E & { target: InstanceType<typeof constructor> } {
    if (!(event.target instanceof constructor)) {
        throw new Error('Target must be an HTMLInputElement')
    }
}

export function report(value: string) {
    if (Window) {
        alert(value)
    } else console.log(value)
}