const ghpages = require("gh-pages");

const ghToken = process.env.GITHUB_TOKEN, gitUser = ghToken ? {
    name: "github-actions-bot",
    email: "support+actions@github.com"
} : {
    name: "Matteo Bruni",
    email: "176620+matteobruni@users.noreply.github.com",
};

ghpages.publish(
    "./public",
    {
        repo: ghToken ? `https://git:${ghToken}@github.com/tsparticles/confetti.git` : `https://git:github.com/tsparticles/confetti.git`,
        dotfiles: true,
        history: false,
        message: "build: gh pages updated",
        user: gitUser,
    },
    function (publishErr) {
        if (!publishErr) {
            console.log("Website published successfully");
        } else {
            console.log(`Error publishing website: ${publishErr}`);
        }
    }
);
