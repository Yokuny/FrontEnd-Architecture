import json
import os

ratings_extra = {
    "pt": {
        "complete.execution": "Serviço todo realizado",
        "partial.execution": "Serviço realizado de forma parcial",
        "rating.satisfactory": "Satisfatório",
        "rating.regular": "Regular",
        "rating.unsatisfactory": "Insatisfatório",
        "rating.meets": "Atende",
        "rating.partially": "Atende parcialmente",
        "rating.does.not.meet": "Não atende",
        "rating.not.applicable": "Não se aplica",
        "question1": "Os equipamentos do fornecedor estavam em boas condições, calibrados e com os registros dos processos analisados?*",
        "question2": "Possui apresentação pessoal apropriada, fornece e utiliza uniformes, EPIs e EPCs necessários para as funções contratadas?*",
        "question3": "Os colaboradores demonstraram as competências e as qualificações técnicas para realização das atividades contratadas?*",
        "question4": "O fornecedor desempenhou as atividades contratadas com qualidade, seguindo o escopo, medições e prazos contratados, com atenção, segundo os procedimentos e boas práticas?*",
        "question5": "O fornecedor demonstrou agilidade, compromisso e postura profissional adequada mesmo em situações adversas?*",
        "question6": "Demonstra interesse em desenvolver inovações para melhorar o serviço prestado em termos de: qualidade, riscos e custos adicionais?*",
        "question7": "Os funcionários são assíduos e pontuais, com retorno aos contatos rapidamente?*",
        "question.1": "Os equipamentos do fornecedor estavam em boas condições, calibrados e com os registros dos processos analisados?*",
        "question.2": "Possui apresentação pessoal apropriada, fornece e utiliza uniformes, EPIs e EPCs necessários para as funções contratadas?*",
        "question.3": "Os colaboradores demonstraram as competências e as qualificações técnicas para realização das atividades contratadas?*",
        "question.4": "O fornecedor desempenhou as atividades contratadas com qualidade, seguindo o escopo, medições e prazos contratados, com atenção, segundo os procedimentos e boas práticas?*",
        "question.5": "O fornecedor demonstrou agilidade, compromisso e postura profissional adequada mesmo em situações adversas?*",
        "question.6": "Demonstra interesse em desenvolver inovações para melhorar o serviço prestado em termos de: qualidade, riscos e custos adicionais?*",
        "question.7": "Os funcionários são assíduos e pontuais, com retorno aos contatos rapidamente?*"
    },
    "en": {
        "complete.execution": "Service fully completed",
        "partial.execution": "Service partially completed",
        "rating.satisfactory": "Satisfactory",
        "rating.regular": "Regular",
        "rating.unsatisfactory": "Unsatisfactory",
        "rating.meets": "Meets",
        "rating.partially": "Partially meets",
        "rating.does.not.meet": "Does not meet",
        "rating.not.applicable": "Not applicable",
        "question1": "Were the supplier's equipment in good condition, calibrated, and with records of the analyzed processes?*",
        "question2": "Does the supplier have appropriate personal presentation, provide and use uniforms, PPE, and necessary EPCs for the contracted functions?*",
        "question3": "Did the collaborators demonstrate the competencies and technical qualifications to perform the contracted activities?*",
        "question4": "Did the supplier perform the contracted activities with quality, following the scope, measurements, and agreed-upon deadlines, with attention, according to procedures and best practices?*",
        "question5": "Did the supplier demonstrate agility, commitment, and appropriate professional demeanor even in adverse situations?*",
        "question6": "Does the supplier show interest in developing innovations to improve the service provided in terms of: quality, risks, and additional costs?*",
        "question7": "Are the employees punctual and reliable, with a quick response to contacts?*",
        "question.1": "Were the supplier's equipment in good condition, calibrated, and with records of the analyzed processes?*",
        "question.2": "Does the supplier have appropriate personal presentation, provide and use uniforms, PPE, and necessary EPCs for the contracted functions?*",
        "question.3": "Did the collaborators demonstrate the competencies and technical qualifications to perform the contracted activities?*",
        "question.4": "Did the supplier perform the contracted activities with quality, following the scope, measurements, and agreed-upon deadlines, with attention, according to procedures and best practices?*",
        "question.5": "Did the supplier demonstrate agility, commitment, and appropriate professional demeanor even in adverse situations?*",
        "question.6": "Does the supplier show interest in developing innovations to improve the service provided in terms of: quality, risks, and additional costs?*",
        "question.7": "Are the employees punctual and reliable, with a quick response to contacts?*"
    },
    "es": {
        "complete.execution": "Servicio totalmente realizado",
        "partial.execution": "Servicio parcialmente completado",
        "rating.satisfactory": "Satisfactorio",
        "rating.regular": "Regular",
        "rating.unsatisfactory": "Insatisfactorio",
        "rating.meets": "Cumple",
        "rating.partially": "Cumple parcialmente",
        "rating.does.not.meet": "No Cumple",
        "rating.not.applicable": "No se aplica",
        "question1": "¿Estaban los equipos del proveedor en buenas condiciones, calibrados y con registros de los procesos analizados?*",
        "question2": "¿Tiene una presentación personal adecuada, proporciona y utiliza uniformes, EPIs y EPCs necesarios para las funciones contratadas?*",
        "question3": "¿Los colaboradores demonstraron las competencias y las calificaciones técnicas para llevar a cabo las actividades contratadas?*",
        "question4": "¿El proveedor realizó las actividades contratadas con calidad, siguiendo el alcance, las mediciones y los plazos acordados, con atención, de acuerdo con los procedimientos y buenas prácticas?*",
        "question5": "¿El proveedor demostró agilidad, compromiso y actitud profesional adecuada incluso en situaciones adversas?*",
        "question6": "¿Muestra el proveedor interés en desarrollar innovaciones para mejorar el servicio proporcionado en términos de: calidad, riesgos y costos adicionales?*",
        "question7": "¿Los empleados son asiduos y puntuales, con respuestas rápidas a los contactos?*",
        "question.1": "¿Estaban los equipos del proveedor en buenas condiciones, calibrados y con registros de los procesos analizados?*",
        "question.2": "¿Tiene una presentación personal adecuada, proporciona y utiliza uniformes, EPIs y EPCs necesarios para las funciones contratadas?*",
        "question.3": "¿Los colaboradores demonstraron las competencias y las calificaciones técnicas para llevar a cabo las actividades contratadas?*",
        "question.4": "¿El proveedor realizó las actividades contratadas con calidad, siguiendo el alcance, las mediciones y los plazos acordados, con atención, de acuerdo con los procedimientos y buenas prácticas?*",
        "question.5": "¿El proveedor demostró agilidad, compromiso y actitud profesional adecuada incluso en situaciones adversas?*",
        "question.6": "¿Muestra el proveedor interés en desarrollar innovaciones para mejorar el servicio proporcionado en términos de: calidad, riesgos y costos adicionales?*",
        "question.7": "¿Los empleados son asiduos y puntuales, con respuestas rápidas a los contactos?*"
    }
}

target_dir = '/Users/yokuny/Documents/GitHub/FrontEnd-Architecture/src/config/translations'

for lang, items in ratings_extra.items():
    target_path = os.path.join(target_dir, f'{lang}.json')
    if os.path.exists(target_path):
        with open(target_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        data.update(items)
        
        # Sort keys
        sorted_data = {k: data[k] for k in sorted(data.keys())}
        
        with open(target_path, 'w', encoding='utf-8') as f:
            json.dump(sorted_data, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}.json with rating questions.")
