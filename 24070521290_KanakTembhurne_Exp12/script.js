
$(document).ready(function () {
    const STORAGE_KEY = "littleStepsStudyPlanner";
    let tasks = [];
    let nextId = 1;
    let currentFilter = "all";

    const defaultTips = [
        {
            title: "Progress over perfection.",
            body: "Focus on one small task at a time. Consistency will take you further than a perfect plan."
        },
        {
            title: "Give your mind a little rest.",
            body: "Try 25 minutes of focused study followed by a 5 minute break to refresh your attention."
        },
        {
            title: "Start with the smallest step.",
            body: "A difficult topic feels easier when you divide it into smaller, manageable tasks."
        },
        {
            title: "Celebrate showing up.",
            body: "Every study session counts. Notice the effort you put in, not only the final result."
        }
    ];

    let tipIndex = 0;

    // Restore saved tasks
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        if (Array.isArray(parsed)) {
            tasks = parsed.filter(task =>
                task &&
                Number.isInteger(task.id) &&
                typeof task.title === "string" &&
                typeof task.done === "boolean" &&
                typeof task.subject === "string" &&
                ["High", "Normal", "Low"].includes(task.priority)
            );
        }
    } catch (error) {
        tasks = [];
    }

    nextId = tasks.reduce(
        (max, task) => Math.max(max, task.id), 0
    ) + 1;

    // Live clock and date
    function updateClock() {
        const now = new Date();

        $("#clock").text(now.toLocaleTimeString());

        $("#todayDate").text(
            now.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric"
            })
        );

        const hour = now.getHours();
        let greeting = "Hello, achiever.";

        if (hour < 12) {
            greeting = "Good morning, achiever.";
        } else if (hour < 17) {
            greeting = "Good afternoon, achiever.";
        } else {
            greeting = "Good evening, achiever.";
        }

        $("#greeting").text(greeting);

        $("#dateLabel").text(
            now.toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric"
            })
        );
    }

    updateClock();
    setInterval(updateClock, 1000);

    // Save task data in localStorage
    function saveTasks() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(tasks)
            );

            $("#saveStatus").text("Saved");
            return true;
        } catch (error) {
            $("#saveStatus").text("Not saved");
            $("#formMessage").text(
                "Browser storage is unavailable. Your changes may not persist."
            );
            return false;
        }
    }

    // Render study tips safely
    function showTip(title, body, number) {
        const content = $("<div>").addClass("tip-content");
        const num = $("<div>")
            .addClass("tip-number")
            .text(String(number).padStart(2, "0"));

        const copy = $("<div>");
        $("<h3>").text(title).appendTo(copy);
        $("<p>").text(body).appendTo(copy);

        content.append(num, copy);
        $("#tips").empty().append(content);
    }

    // Display tasks dynamically
    function renderTasks() {
        const list = $("#taskList");
        list.empty();

        const visibleTasks = tasks.filter(task => {
            if (currentFilter === "pending") {
                return !task.done;
            }

            if (currentFilter === "completed") {
                return task.done;
            }

            return true;
        });

        if (visibleTasks.length === 0) {
            const empty = $("<div>").addClass("empty-state");

            $("<span>").text("🌱").appendTo(empty);

            $("<strong>")
                .text(
                    currentFilter === "completed"
                        ? "Your wins will live here."
                        : currentFilter === "pending"
                            ? "All caught up!"
                            : "A fresh page awaits."
                )
                .appendTo(empty);

            $("<p>")
                .text(
                    currentFilter === "pending"
                        ? "No pending tasks. Enjoy the breathing room."
                        : currentFilter === "completed"
                            ? "Complete a task to see it here."
                            : "Add a little task and start growing."
                )
                .appendTo(empty);

            list.append(empty);
        }

        visibleTasks.forEach(function (task) {
            const row = $("<article>")
                .addClass("task")
                .toggleClass("completed", task.done);

            const checkbox = $("<input>")
                .attr({
                    type: "checkbox",
                    "aria-label": "Complete " + task.title
                })
                .addClass("task-check")
                .prop("checked", task.done)
                .on("change", function () {
                    task.done = this.checked;
                    saveTasks();
                    renderTasks();
                });

            const info = $("<div>").addClass("task-info");

            $("<strong>")
                .text(task.title)
                .appendTo(info);

            const metadata = task.subject;

            const details = $("<small>").text(metadata);

            if (task.dueDate) {
                details.text(
                    metadata + " | Due " + task.dueDate
                );
            }

            info.append(details);

            $("<span>")
                .addClass("priority " + task.priority)
                .text(task.priority + " priority")
                .appendTo(info);

            const deleteButton = $("<button>")
                .addClass("delete-btn")
                .attr({
                    type: "button",
                    "aria-label": "Delete " + task.title,
                    title: "Delete task"
                })
                .text("×")
                .on("click", function () {
                    tasks = tasks.filter(
                        item => item.id !== task.id
                    );

                    saveTasks();
                    renderTasks();
                });

            row.append(checkbox, info, deleteButton);
            list.append(row);
        });

        // Update statistics
        const total = tasks.length;
        const completed = tasks.filter(task => task.done).length;
        const remaining = total - completed;
        const percentage = total
            ? Math.round((completed / total) * 100)
            : 0;

        $("#totalTasks").text(total);
        $("#completedTasks").text(completed);
        $("#percentage").text(percentage + "%");
        $("#progressBar, #miniBar").css("width", percentage + "%");

        $("#progressLabel").text(
            completed + " of " + total + " completed"
        );

        $("#remainingLabel").text(
            remaining === 0 && total > 0
                ? "Lovely work! All tasks completed."
                : "You have " + remaining + " tasks left."
        );

        $("#taskCount").text(
            total + (total === 1 ? " task" : " tasks")
        );

        $("#clearCompleted").prop(
            "disabled",
            completed === 0
        ).css("opacity", completed === 0 ? 0.45 : 1);
    }

    // Add task using the submit event
    $("#taskForm").on("submit", function (event) {
        event.preventDefault();

        const title = $("#taskName").val().trim();

        if (!title) {
            $("#formMessage").text(
                "Please enter a task name first."
            );
            return;
        }

        tasks.push({
            id: nextId++,
            title: title,
            subject: $("#subject").val(),
            priority: $("#priority").val(),
            dueDate: $("#dueDate").val(),
            done: false
        });

        saveTasks();
        renderTasks();

        this.reset();

        $("#formMessage").text("A new little step has been added!");
        $("#taskName").trigger("focus");
    });

    // Switch task filters using jQuery events
    $(".filter-btn").on("click", function () {
        currentFilter = $(this).data("filter");

        $(".filter-btn")
            .removeClass("active")
            .attr("aria-pressed", "false");

        $(this)
            .addClass("active")
            .attr("aria-pressed", "true");

        renderTasks();
    });

    // Clear all completed tasks
    $("#clearCompleted").on("click", function () {
        tasks = tasks.filter(task => !task.done);
        saveTasks();
        renderTasks();
        $("#formMessage").text("Completed tasks have been cleared.");
    });

    // AJAX: Load study inspiration from an online JSON API
    $("#loadTips").on("click", function () {
        const button = $(this);

        button.prop("disabled", true)
            .text("Finding inspiration...");

        $("#apiStatus").text("Connecting to the study tips service...");

        $.ajax({
            url: "https://jsonplaceholder.typicode.com/posts",
            method: "GET",
            data: { _limit: 5 },
            dataType: "json",
            timeout: 10000
        })
        .done(function (data) {
            if (!Array.isArray(data) || data.length === 0) {
                $("#apiStatus").text("No online tips were returned.");
                return;
            }

            // Display the fetched JSON data as study inspiration
            const post = data[tipIndex % data.length];
            tipIndex++;

            const title = post.title
                .split(" ")
                .map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                )
                .join(" ");

            showTip(
                title,
                "A little inspiration from an online JSON service. Take this idea and turn it into one small action in your study plan.",
                tipIndex
            );

            $("#apiStatus").text(
                "Online JSON loaded successfully using jQuery AJAX."
            );
        })
        .fail(function () {
            // The planner still works without an internet connection
            const tip = defaultTips[
                tipIndex % defaultTips.length
            ];

            tipIndex++;

            showTip(tip.title, tip.body, tipIndex);

            $("#apiStatus").text(
                "Offline fallback tip displayed. Check your connection to load online data."
            );
        })
        .always(function () {
            button.prop("disabled", false)
                .html("Find more inspiration <span>↗</span>");
        });
    });

    // Initial render
    renderTasks();

    $(".filter-btn").attr("aria-pressed", "false");
    $('.filter-btn[data-filter="all"]').attr("aria-pressed", "true");

    $("#clearCompleted").on("click", function () {
        $("#apiStatus").text("Your task list has been updated.");
    });
});
