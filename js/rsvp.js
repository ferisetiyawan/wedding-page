const googleCalendarBase =
    "https://calendar.google.com/calendar/render?action=TEMPLATE";

document.getElementById("rsvpForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const pax = parseInt(document.getElementById("pax").value);
    const responseBox = document.getElementById("formResponse");

    if (!name || pax < 1 || pax > 2) {
        responseBox.classList.add("rsvp-error");
        responseBox.innerText =
            "Name and Pax (1-2) are required.";
        return;
    }

    try {
        const url = "https://script.google.com/macros/s/AKfycbyN5xBvZU4Pp_QHyKG8OpBKJ68YwZbFdbsv1c9Oz94PbOKLXtKFJ5Y2Sc2SaaSd3fjE/exec";
        const mydata = JSON.stringify({ name, pax });
        
        $.post(url, mydata, function (response) {
            if (response.status === "success") {
                responseBox.classList.remove("rsvp-error");
                responseBox.innerText =
                    "Thank you! Your RSVP has been recorded.";
                document.getElementById("calendarLinks").style.display = "block";

                document.getElementById("name").setAttribute("readonly", true);
                document.getElementById("pax").setAttribute("readonly", true);

                const submitBtn = document.querySelector("#rsvpForm button[type='submit']");
                submitBtn.disabled = true;
                submitBtn.innerText = "RSVP Sent ✔";

                setGoogleCalendarLink(name);
            } else {
                responseBox.classList.add("rsvp-error");
                responseBox.innerText =
                    "Failed to submit RSVP: " + response.message;
            }
        });
    } catch (err) {
        responseBox.classList.add("rsvp-error");
        responseBox.innerText =
          "Error connecting to RSVP system.";
    }
});

function setGoogleCalendarLink(name) {
    const title = encodeURIComponent("Wedding of Yanie & Feri");
    const location = encodeURIComponent("LePolonia Hotel & Convention, Jl. Jenderal Sudirman No.14-18, Madras Hulu, Kec. Medan Polonia, Kota Medan, Sumatera Utara 20152, Indonesia");
    const details = encodeURIComponent(
        `Dear ${name},\n\nThank you for your RSVP to our wedding.\n\nWe are delighted to invite you to celebrate our special day:\n\n📅 Date: 25 May 2025\n⏰ Time: 09.00 WIB\n📍 Location: LePolonia Hotel & Convention\n\nWe look forward to sharing this joyful moment with you.\n\nWarm regards,\nYanie & Feri`
      );
    const dates = "20250525T040000Z/20250525T070000Z"; // UTC time

    const googleUrl = `${googleCalendarBase}&text=${title}&location=${location}&details=${details}&dates=${dates}`;
    document.getElementById("googleCal").href = googleUrl;
}

function downloadICS() {
    const name = document.getElementById("name").value.trim();
    const title = "Wedding of Yanie & Feri";
    const location = "LePolonia Hotel & Convention, Medan";
    const startDate = "20250525T110000"; // local time
    const endDate = "20250525T140000";
    const description = `Dear ${name}, thank you for your RSVP.`;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wedding RSVP//EN
BEGIN:VEVENT
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${description}
DTSTART:${startDate}
DTEND:${endDate}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: "text/calendar" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "wedding-invitation.ics";
    link.click();
}
