
export function generateSlug(input) {
    if (!input && input !== 0) return '';

    let s = String(input);

    s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    s = s.replace(/đ/g, 'd').replace(/Đ/g, 'D');

    s = s.replace(/[^A-Za-z0-9\s-]/g, '');

    // Lowercase
    s = s.toLowerCase();

    s = s.trim().replace(/\s+/g, '-');

    s = s.replace(/-+/g, '-');

    return s;
}
