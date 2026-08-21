import $ from 'jquery';

$(document).ready(function () {
$(".col1row1").click(function () {
    $('.col2row1, .col1row2, .col2row2').toggleClass("hidden");
    if ($(".sensorInfoBox").hasClass("active")) {
        $(".sensorInfoBox").removeClass("active");
    } else {
        $(".sensorInfoBox").addClass("active");
    }

    if ($(".sensorTitle1").hasClass("active")) {
        $(".sensorTitle1").removeClass("active");
    } else {
        $(".sensorTitle1").addClass("active");
    }

    if ($(".chartSkills").hasClass("active")) {
        $(".chartSkills").removeClass("active");
    } else {
        $(".chartSkills").addClass("active");
    }

    if ($(".chartSkills::before").hasClass("active")) {
        $(".chartSkills::before").removeClass("active");
    } else {
        $(".chartSkills::before").addClass("active");
    }

    if ($(".chartSkills li").hasClass("active")) {
        $(".chartSkills li").removeClass("active");
    } else {
        $(".chartSkills li").addClass("active");
    }

    if ($(".halfLine1").hasClass("active")) {
        $(".halfLine1").removeClass("active");
    } else {
        $(".halfLine1").addClass("active");
    }

    if ($(".halfLine4").hasClass("active")) {
        $(".halfLine4").removeClass("active");
    } else {
        $(".halfLine4").addClass("active");
    }

    if ($(".sensorText0").hasClass("active")) {
        $(".sensorText0").removeClass("active");
    } else {
        $(".sensorText0").addClass("active");
    }

    if ($(".sensorText1").hasClass("active")) {
        $(".sensorText1").removeClass("active");
    } else {
        $(".sensorText1").addClass("active");
    }

    if ($(".sensorText2").hasClass("active")) {
        $(".sensorText2").removeClass("active");
    } else {
        $(".sensorText2").addClass("active");
    }

    if ($(".sensorText3").hasClass("active")) {
        $(".sensorText3").removeClass("active");
    } else {
        $(".sensorText3").addClass("active");
    }

    if ($(".sensorLH").hasClass("active")) {
        $(".sensorLH").removeClass("active");
    } else {
        $(".sensorLH").addClass("active");
    }

    if ($(".figure").hasClass("active")) {
        $(".figure").removeClass("active");
    } else {
        $(".figure").addClass("active");
    }

    if ($(".stickAngle20").hasClass("active")) {
        $(".stickAngle20").removeClass("active");
    } else {
        $(".stickAngle20").addClass("active");
    }

});

$(".col2row1").click(function () {
    $('.col1row1, .col1row2, .col2row2').toggleClass("hidden");
    if ($(".sensorInfoBox").hasClass("active")) {
        $(".sensorInfoBox").removeClass("active");
    } else {
        $(".sensorInfoBox").addClass("active");
    }

    if ($(".sensorTitle1").hasClass("active")) {
        $(".sensorTitle1").removeClass("active");
    } else {
        $(".sensorTitle1").addClass("active");
    }

    if ($(".chartSkills").hasClass("active")) {
        $(".chartSkills").removeClass("active");
    } else {
        $(".chartSkills").addClass("active");
    }

    if ($(".chartSkills::before").hasClass("active")) {
        $(".chartSkills::before").removeClass("active");
    } else {
        $(".chartSkills::before").addClass("active");
    }

    if ($(".chartSkills li").hasClass("active")) {
        $(".chartSkills li").removeClass("active");
    } else {
        $(".chartSkills li").addClass("active");
    }

    if ($(".halfLine1").hasClass("active")) {
        $(".halfLine1").removeClass("active");
    } else {
        $(".halfLine1").addClass("active");
    }

    if ($(".halfLine4").hasClass("active")) {
        $(".halfLine4").removeClass("active");
    } else {
        $(".halfLine4").addClass("active");
    }

    if ($(".sensorText0").hasClass("active")) {
        $(".sensorText0").removeClass("active");
    } else {
        $(".sensorText0").addClass("active");
    }

    if ($(".sensorText1").hasClass("active")) {
        $(".sensorText1").removeClass("active");
    } else {
        $(".sensorText1").addClass("active");
    }

    if ($(".sensorText2").hasClass("active")) {
        $(".sensorText2").removeClass("active");
    } else {
        $(".sensorText2").addClass("active");
    }

    if ($(".sensorText3").hasClass("active")) {
        $(".sensorText3").removeClass("active");
    } else {
        $(".sensorText3").addClass("active");
    }

    if ($(".sensorLH").hasClass("active")) {
        $(".sensorLH").removeClass("active");
    } else {
        $(".sensorLH").addClass("active");
    }

    if ($(".figure").hasClass("active")) {
        $(".figure").removeClass("active");
    } else {
        $(".figure").addClass("active");
    }

    if ($(".stickAngle20").hasClass("active")) {
        $(".stickAngle20").removeClass("active");
    } else {
        $(".stickAngle20").addClass("active");
    }

    if ($(".halfCircleText_100").hasClass("active")) {
        $(".halfCircleText_100").removeClass("active");
    } else {
        $(".halfCircleText_100").addClass("active");
    }

});
})