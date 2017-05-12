let win1 = null,
    timer1 = null,
    win2 = null,
    timer2 = null
export const google = (cb) => {
    if (win1 !== null) {
        win1.focus()
        return
    }
    win1 = window.open('/oauth/google', 'google', 'width=450px, height=600px');
    timer1 = setInterval(() => {
        try {
            if (win1 === null || win1.closed) {
                win1 = null
                clearInterval(timer1)
                    // callback //
                if (cb) {
                    cb()
                }
            }
        } catch (e) {}
    }, 800)


}

export const facebook = (cb) => {
    if (win2 !== null) {
        win2.focus()
        return
    }
    win2 = window.open('/oauth/facebook', 'fb', 'width=400px, height=400px');
    timer2 = setInterval(() => {
        try {
            if (win2 === null || win2.closed) {
                win2 = null
                clearInterval(timer2)
                    // callback //
                if (cb) {
                    cb()
                }
            }
        } catch (e) {}
    }, 800)
}
