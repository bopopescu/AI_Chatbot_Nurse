from sklearn.model_selection import train_test_split
from sklearn.metrics import confusion_matrix
import numpy as np
import argparse
from sklearn.svm import SVC
import csv
import json
import os
from flask import Flask, request
from scipy import stats
from sklearn.model_selection import KFold
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.ensemble import AdaBoostClassifier
from sklearn.feature_selection import SelectKBest
from sklearn.feature_selection import f_classif

app = Flask(__name__)

with open('HeartDisease.csv', encoding='utf8') as data:
	training_set = csv.reader(data, delimiter=',')
	labelsTrain = []
	train = []

	for row in training_set:
		new_arr = []
		for r in row:
			if r == '':
				new_arr.append(0)
			else:
				new_arr.append(r)
		print(row, len(row))
		labelsTrain.append(new_arr[-2:-1][0])
		train.append(new_arr[1:-2])
	print("training")
	svc = SVC(kernel="linear", probability=True)
	svc.fit(train, labelsTrain)
	print("trained")

@app.route('/predict', methods=["POST"])
def predict():
	"""
	predict
	"""
	recieved = request.get_json(force=True)
	data = recieved['data']
	print("data", data)
	score = svc.predict_proba([data])
	prediction = svc.predict([data])
	print("prediction:", prediction, "score:", score)
	return json.dumps({"prediction": prediction[0], "score": score[0][0]})


if __name__ == "__main__":
	app.run(debug=True, port=6000)
	# svc = svc.decision_function(test)[0]
