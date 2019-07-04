
export function getJwtBody(token: string) {
    try {
        const dotParts = token.split('.');
        if (dotParts.length !== 3) {
            return null;
        }
        // ensure the header is somewhat valid
        const header = JSON.parse(atob(dotParts[0]));
        if (header.typ !== "JWT") {
            return null;
        }
        const body = JSON.parse(atob(dotParts[1])) as Record<string, any>;
        return body;
    } catch (ex) {
        console.log(ex);
        return null;
    }

}
