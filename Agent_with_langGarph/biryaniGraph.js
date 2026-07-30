import { END, MessagesValue, START, StateGraph, StateSchema } from "@langchain/langgraph";
import { writeFile } from "node:fs/promises";


/**
 * Cut the Vegetables (Node)
 */
function cutTheVegetables(state) {
  console.log("Cutting the vegetables..");
  return state;
}

/**
 * Boil the Rice (Node)
 */
function boilTheRice(state) {
  console.log("Boil the rice..");
  return state;
}

/**
 * Add the Salt (Node)
 */
function addTheSalt(state) {
  console.log("Add the salt..");
  return state;
}

/**
 * Taste the biryani (Node)
 */
function tasteTheBiryani(state) {
  console.log("Taste the biryani..");
  return state
}

function whereToGo(){
    if(true){
        return END
    }else{
       return "addTheSalt"
    }
}


const MessagesState = new StateSchema({
  messages: MessagesValue,
//   llmCalls: new ReducedValue(
//     z.number().default(0),
//     { reducer: (x, y) => x + y }
//   ),
});

const graph = new StateGraph(MessagesState)
  .addNode("cutTheVegetables", cutTheVegetables)
  .addNode("boilTheRice", boilTheRice)
  .addNode("addTheSalt", addTheSalt)
  .addNode("tasteTheBiryani", tasteTheBiryani)
  .addEdge(START, "cutTheVegetables")
  .addEdge("cutTheVegetables", "boilTheRice")
  .addEdge("boilTheRice", "addTheSalt")
  .addEdge("addTheSalt", "tasteTheBiryani")
  .addConditionalEdges("tasteTheBiryani", whereToGo, ["addTheSalt", END])

  const agent = graph.compile();
const image = await agent.getGraph().drawMermaidPng();
await writeFile("graph.png", Buffer.from(await image.arrayBuffer()));

const result = await agent.invoke({
  messages: [],
});


console.log(result);
