import { toast } from "react-toastify";

export function toaster(type, msg) {
    switch (type) {
        case 'success':
            toast.success(msg);
            break;
        case 'warn':
            toast.warn(msg);
            break;

        default:
            toast.info(msg);
            break;
    }
}
