var target_goal = 100000;
var total_progress = 0;
var user_contribution = 0;
var update_interval = 3000;
var first_run = true;

function check_activity(){
  if(!is_goal_met()){
    $.post("record_progress.php",
      {
          activity: "check_activity",
      }, 'json')
      .done(function(data){
        if(data.status=="accepted"){
          enable_task();
        }else{
          disable_task();
          set_task_message(data.message);
        } 
      });
  }
}

function disable_task(){
  var timeout = parseInt(arguments[0]) || 10000;
  $(".task_active").removeClass("task_active").addClass("task_inactive");
  $("#worker_action").unbind("click");
  window.setTimeout(function(){
    check_activity();
    }, timeout);
}

function enable_task(){ 
  set_task_message('');
  $("#action_response_kah").hide();
  $(".task_inactive").removeClass("task_inactive").addClass("task_active");
  $("#worker_action").click(function(e){
    e.preventDefault();
    $.post("record_progress.php",
    {
        activity: "record_progress",
    }, 'json')
    .done(function(data){
      if(data.status=="rejected"){
        disable_task();
        set_task_message(data.message,'negative_response');
      }else{
        first_run = false;
        set_task_message(data.message,'affirmative_response');
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
  set_task_message('Signal Decrypted!','goal_accomplished');
  if(!first_run){
    window.location.reload();
  }
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
  if(arguments[1]){
    $("#action_response_kah").removeAttr("class");
    $("#action_response_kah").addClass(arguments[1]);
  }
  $("#action_response").html(text);
  $("#action_response_kah").fadeIn();
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
