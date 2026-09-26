import { redirectToLocale } from "../functions-lib/locale";

export const onRequestGet: PagesFunction = ({ request }) => redirectToLocale(request, "/help");
