import { BotPlugin } from "../../botPlugin/BotPlugin";

const sleep = (s = 10) => {
  return new Promise<void>(resolve => setTimeout(() => resolve(), s * 1000));
}

const testPlugin = new BotPlugin("test", "");
testPlugin.addTask("task1", async () => {
  return sleep(10).then(res => { 
    console.log("task1 end");
    return 1;
  });
})

testPlugin.addTask("task2", () => {
  return sleep(2).then(res => {
    console.log("task2 end");
    return 2;
  });
})

testPlugin.addTask("task3", async () => {
  return sleep(3).then(res => {
    throw new Error("task3 error");
    console.log("task3 end");
    return 3;
  });
})

testPlugin.addTask("task4", async () => {
  return sleep(4).then(res => {
    console.log("task4 end");
    return 4;
  });
})

testPlugin.execTaskList().then(res => { 
  console.log(res);
})


