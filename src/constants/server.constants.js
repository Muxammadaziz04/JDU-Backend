const constants = {
    PORT: process.env.PORT || 4000,
    colorRegex: /^(#([a-fA-F0-9]{3}){1,2}|rgb(a)?\((\d{1,2}|1\d{2}|2[0-4]\d|25[0-5]),\s*(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5]),\s*(\d{1,2}|1\d{2}|2[0-4]\d|25[0-5])(,\s*(0|1|0?\.\d+))?\)|hsl(a)?\((\d{1,3}),\s*(\d{1,3})%,\s*(\d{1,3})%(,\s*(0|1|0?\.\d+))?\))$/i,
    publicRoutes: ['/auth/login'],
    roles: {
        RECRUITOR: 'recruitor',
        STUDENT: 'student',
        DECAN: 'decan'
    },
    languages: ['uz', 'jp', 'en']
}

module.exports = constants