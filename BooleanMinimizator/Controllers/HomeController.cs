using BooleanMinimizator.Models;
using BooleanMinimizerLibrary;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace BooleanMinimizator.Controllers
{
    /// Основной контроллер приложения для работы с булевыми функциями
    public class HomeController : Controller
    {
        /// GET-метод для отображения начальной страницы калькулятора
        [HttpGet]
        public IActionResult Index()
        {
            return View(new BooleanMinimizatorModel());
        }

        /// POST-метод для обработки введенной функции и отображения результатов
        [HttpPost]
        public IActionResult Index(BooleanMinimizatorModel model)
        {
            if (!string.IsNullOrEmpty(model.InputFunction))
            {
                try
                {
                    // Синтаксический анализ введенной функции
                    var syntaxAnalyzer = new SyntaxAnalyzer();
                    Node rootNode = syntaxAnalyzer.Parse(model.InputFunction);

                    // Построение вектора функции и таблицы истинности
                    var functionVectorBuilder = new FunctionVectorBuilder();
                    model.VectorOutput = functionVectorBuilder.BuildVector(rootNode);
                    model.TruthTable = functionVectorBuilder.BuildTruthTable(rootNode);
                    
                    // Получение нормальных форм
                    model.MDNFOutput = BooleanMinimizer.MinimizeSDNF(model.VectorOutput);
                    model.MKNFOutput = BooleanMinimizer.MinimizeSKNF(model.VectorOutput);
                    model.SKNFOutput = BooleanMinimizer.GetFullSKNF(model.VectorOutput);
                    model.SDNFOutput = BooleanMinimizer.GetFullSDNF(model.VectorOutput);

                    // Построение карты Карно
                    var karnaughBuilder = new KarnaughMapBuilder();
                    model.KarnaughSteps = karnaughBuilder.BuildSteps(rootNode);
                    model.KarnaughMap = model.KarnaughSteps.Last().Map; // Итоговая карта
                    
                    // Получение переменных и выделение областей
                    model.Variables = karnaughBuilder.GetVariablesFromMap(model.KarnaughMap);
                    model.Areas = karnaughBuilder.FindAllMaximalAreas(model.KarnaughMap);
                    model.ZeroAreas = karnaughBuilder.FindAllMaximalZeroAreas(model.KarnaughMap);

                    model.ResultMessage = "Функция успешно распознана!";
                    model.IsSolved = true;
                }
                catch (Exception ex)
                {
                    model.ResultMessage = $"Ошибка: {ex.Message}";
                    model.IsSolved = false;
                }
            }
            return View(model);
        }
        
        /// Метод для отображения страницы ошибки
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}