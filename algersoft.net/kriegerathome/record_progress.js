var target_goal = 100000;
var total_progress = 0;
var user_contribution = 0;
var update_interval = 3000;
var first_run = true;
var time_remaining = 0;
var calibration_authentication = false;
var message_timeout = null;

function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function calibrate_attack(){
  $.post("calibrate_attack.php",
    {
        auth: calibration_authentication,
    }, 'json')
    .done(function(data){
      if(data.status=="accepted"){
        enable_task();
      }
      set_task_message(data.message,"calibrate",5000);
    });
}

function check_activity(){
  if(!is_goal_met()){
    $.post("attack.php",
      {
          activity: "check_activity",
      }, 'json')
      .done(function(data){
        if(data.status=="not_calibrated"){
          enable_calibration();
        }else if(data.status=="calibrated"){
          enable_task();
        }else{
          time_remaining = data.remaining_time;
          disable_task();
          set_task_message(data.message);
        } 
      });
  }
}

function disable_task(){
  start_clock();
  $(".task_active").removeClass("task_active").addClass("task_inactive");
  $("#worker_action").unbind("click");
}

function enable_calibration(){
  $("#worker_action").click(function(e){
    e.preventDefault();
      calibrate_attack();
  });
}

function enable_task(){ 
  $("#button_container_kah").removeAttr("class").addClass("attack");
  $("#worker_action span").text("ATTACK!");
  set_task_message(false);
  $("#action_response_kah").hide();
  $(".task_inactive").removeClass("task_inactive").addClass("task_active");
  $("#worker_action").click(function(e){
    e.preventDefault();
    $.post("attack.php",
    {
        activity: "record_progress",
    }, 'json')
    .done(function(data){
      if(data.status=="rejected"){
        time_remaining = data.remaining_time;
        disable_task();
        set_task_message(data.message,'negative_response');
      }else{
        first_run = false;
        set_task_message(data.message,'affirmative_response',10000);
        update_totals();
      }
    })
    .fail(function(data){
      set_task_message("Sorry. Something went wrong. Please try again later.",'negative_response');
    });
  });
}

function end_mission(){
  window.clearInterval(update_totals);
  set_task_message('<h1>Signal Decrypted!</h1>','goal_accomplished');
  if(!first_run){
    window.location.reload();
  }
}

function get_time_remaining(){
  var t = new Date(time_remaining);
  return addZero(t.getMinutes()) + ":" + addZero(t.getSeconds());
}

function is_goal_met(){
  if(parseInt(total_progress) >= parseInt(target_goal)){
    return true;
  }
  return false;
}

function load_tasks(){
  check_activity();
  update_totals();
  window.setInterval(update_totals,update_interval);
  
}
function set_task_message(text){
  window.clearTimeout(message_timeout);
  if(arguments[1]){
    $("#action_response_kah").removeAttr("class");
    $("#action_response_kah").addClass(arguments[1]);
  }
  if(text==false){
    $("#action_response_kah").fadeOut("fast",function(){
      $("#action_response").html();
      $("#action_response_kah").removeAttr("class");
    });
  }else{
    $("#action_response").html(text);
    $("#action_response_kah").fadeIn(); 
  }
  if(arguments[2]){
    message_timeout = window.setTimeout(function(){
      set_task_message(false);
    },arguments[2]);
  }
}

function start_clock(){
  update_clock();
  window.setInterval(update_clock,1000);
}

function stop_clock(){
  window.clearInterval(update_clock);
  window.location.reload();
}

function update_clock(){
  if(time_remaining <= 0){
    stop_clock();
    return false;
  }
  time_remaining -= 1000;
  $("#button_container_kah").removeAttr("class").addClass("countdown");
  $("#worker_action span").text(get_time_remaining());
}

function update_totals(){
  $('.total_progress').load('get_totals.php', function(str){
    total_progress = parseInt(str);
    update_progress_bar();
  });
  user_contribution += 1;
  $("#user_contribution").html(user_contribution);    
  if(is_goal_met()){
    end_mission();
  }
}

function update_progress_bar(){
  var percentage = parseFloat((parseInt(total_progress) / parseInt(target_goal))*100).toFixed(2);
  $("#current_progress").width(percentage + "%");
  $(".percentage_update").text(percentage);
}
